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
      path: '/',                      // Route path appended to base path ('/users/')
      method: HTTP_METHODS.GET,       // HTTP method
      handler: this.getUsers,         // Route handler
      localMiddleware: [],            // Route-specific middleware (optional)
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
import express from 'express';
import Server from './core/server';
import UserController from './modules/user/user.controller';

const app = express();
const server = new Server(app, 3000);

const controllers = [new UserController()];

async function bootstrap() {
  server.LoadControllers(controllers);
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