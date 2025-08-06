## Purpose of the Controller Class

This is an abstract base class designed for a modular, object-oriented Express.js application using TypeScript. All your specific route controllers (like UserController, AuthController, etc.) will inherit from this class to ensure consistency and reduce repetition in how routes are defined and registered.

### File Overview

```ts
import { Router } from 'express';
import { IRoute } from './types';
```

-   Router: This is Express' built-in class used to create modular route handlers.
-   IRoute: This is a TypeScript interface that defines the shape of each route config object (method, path, handler, middleware). It's imported from a types.ts file.

### Class Definition

```ts
export default abstract class Controller {}
```

-   This is an abstract class, meaning:
    -   It can't be instantiated directly.
    -   It’s meant to be extended by other classes (like UserController).
    -   It enforces structure, such as requiring path and routes.

### Router Property

```ts
public router: Router = Router();
```

-   This creates a new Express Router instance.
-   All defined routes inside this controller will be attached to this router.
-   Later, this router is mounted on a specific base path in the app (e.g., /api/v1/users).

### Abstract path

```ts
public abstract path: string;
```

-   Each child controller must provide a path string, e.g., /users.
-   This path is used when mounting the controller inside your Server Class:

```ts
app.use(controller.path, controller.setRoutes());
```

### Abstract routes

```ts
protected abstract readonly routes: IRoute[];
```

-   This enforces that any controller extending this base class must provide a list of routes.
-   IRoute[] defines the structure:

```ts
interface IRoute {
	path: string;
	method: 'get' | 'post' | 'put' | 'delete'; // etc.
	handler: RequestHandler;
	localMiddleware: RequestHandler[];
}
```

---

### Detailed Explanation of `setRoutes()` Method

```ts
public setRoutes(prefixPath = ''): Router {
  for (const route of this.routes) {
    const { path, method, handler, localMiddleware } = route;

    // Check if the HTTP method exists on the Express router instance
    if (typeof this.router[method] !== 'function') {
      console.error(
        chalk.red(
          `[Routing Error] Invalid HTTP method "${method}" used in route "${path}" of controller "${this.name}".`
        )
      );
      continue; // Skip this route and continue with the next
    }

    // Compose the full route path by concatenating the controller prefix and route path
    const fullPath = `${prefixPath}${path}`.replace(/\/+/g, '/'); // Normalize multiple slashes

    // Combine any local middleware with the main route handler
    const routeHandlers = [...localMiddleware, handler.bind(this)];

    // Register the route on the router using the HTTP method, path, and handlers
    this.router[method](path, ...routeHandlers);

    // Log the successful route registration with colors for clarity
    console.log(
      `${chalk.greenBright(`[${this.name}] Route`)} ${chalk.cyanBright(
        `[${method.toUpperCase()}]`
      )} ${chalk.yellowBright(fullPath)}`
    );
  }

  // Return the configured router instance so it can be mounted by the server
  return this.router;
}
```

---

### Step-by-step Breakdown

1. **Purpose**

    The `setRoutes()` method dynamically registers all the routes defined in the controller’s `routes` array on an Express `Router` instance.

2. **Parameters**

    - `prefixPath` (optional string): The base URL prefix for the controller (e.g., `'/users'`). This allows constructing full route paths that reflect the controller’s mounting point.

3. **Looping over Routes**

    The method iterates through each route defined in the `routes` array, where each route describes:

    - `path`: The endpoint path relative to the controller prefix (e.g., `'/'`, `'/profile'`).
    - `method`: The HTTP method as a string (`'get'`, `'post'`, etc.).
    - `handler`: The function that handles the request.
    - `localMiddleware`: Optional middleware functions specific to this route.

4. **Validation**

    It checks if the `method` corresponds to a valid Express router method (like `.get()`, `.post()`, etc.).

    - If invalid, it logs a red error message with `chalk` and skips that route.

5. **Full Path Construction**

    Concatenates the `prefixPath` (controller base route) with the route’s relative `path` and normalizes slashes to avoid duplicates.

    - For example, `prefixPath='/users'` and `path='/'` becomes `/users/`.

6. **Middleware and Handler Setup**

    Creates an array `routeHandlers` combining:

    - Any `localMiddleware` functions defined for the route.
    - The main route handler, bound to the controller instance (`handler.bind(this)`) to preserve `this` context.

7. **Route Registration**

    Calls the Express router method dynamically:

    ```ts
    this.router[method](path, ...routeHandlers);
    ```

    This registers the route and attaches all middleware and handler in order.

8. **Logging**

    Prints a colored, informative log showing:

    - Which controller (`this.name`) registered the route
    - The HTTP method (capitalized)
    - The full resolved URL path

9. **Return**

    Finally, the fully configured `Router` instance is returned for mounting on the main Express app by the server.

---

### Why This Design?

-   **Flexibility:** You define all routes in one array with metadata, making it easy to add/remove routes.
-   **Readability:** Clear logs and structured routing help debugging and maintenance.
-   **Modularity:** Each controller manages its own routes, improving scalability.
-   **Context Safety:** Binding handlers ensures `this` works correctly inside methods.
-   **Middleware Support:** Route-level middleware can be specified easily.

---

## Controller Usage Example

### 1. Create a Controller by extending `BaseController`

```ts
import { Request, Response } from 'express';
import BaseController from '../../core/base-controller';
import { HTTP_METHODS, IRoute } from '../../core/types';

export default class UserController extends BaseController {
	// Base path for this controller's routes
	public path = 'users';

	// Define routes for this controller
	protected readonly routes: IRoute[] = [
		{
			path: '/', // Route path appended to base path ('/users/')
			method: HTTP_METHODS.GET, // HTTP method
			handler: this.getUsers, // Route handler
			localMiddleware: [
				(req, res, next) => {
					console.log('Middleware: Validating createUser request');
					next();
				},
			], // Route-specific middleware (optional)
		},
		{
			path: '/',
			method: HTTP_METHODS.POST,
			handler: this.createUser,
			localMiddleware: [],
		},
	];

	// Handler for GET /users
	private getUsers(req: Request, res: Response) {
		res.send('List of users');
	}

	// Handler for POST /users
	private createUser(req: Request, res: Response) {
		res.send('User Created');
	}
}
```

### 2. Register Controller in your main app bootstrap

```ts
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, RequestHandler } from 'express';
import morgan from 'morgan';

import { appConfig } from './config/app.config';
import BaseController from './core/base-controller';
import Server from './core/server';
import errorHandler from './middlewares/errorHandler';
import UserController from './modules/user/user.controller';

const app: Application = express();
const PORT = appConfig.port;

const controllers: BaseController[] = [
	new UserController(), // add the controller
];

const globalMiddleware: RequestHandler[] = [
	express.json(),
	express.urlencoded({ extended: false }),
	cors(),
	cookieParser(),
	morgan(':method :url :status :res[content-length] - :response-time ms'),
];

const server = new Server(app, PORT);
async function bootstrap() {
	await server.ConnectDB();
	server.LoadMiddleware(globalMiddleware);
	server.LoadControllers(controllers);
	server.AddErrorHandler(errorHandler);
	server.run();
}

bootstrap();
```

### 3. Routes exposed

| HTTP Method | Route    | Description         |
| ----------- | -------- | ------------------- |
| GET         | `/users` | Fetch list of users |
| POST        | `/users` | Create a new user   |

You can add route-specific middleware by including them in the localMiddleware array for each route.
