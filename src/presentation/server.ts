import express, { Router } from 'express';
import http from 'http';
import path from 'path';

interface Options {
  port: number;
  publicPath?: string;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private serverListener: http.Server | undefined;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, publicPath = 'public', routes } = options;
    this.port = port;
    this.publicPath = publicPath;
    this.routes = routes;
  }

  async start() {
    // * Middlewares
    this.app.use(express.json()); // every request will be serialized as JSON
    this.app.use(express.urlencoded({ extended: true })); // every request will be serialized x-www-form-urlencoded

    //* Public folder
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    //* public folder to serve SPA's
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname, `../../${this.publicPath}/index.html`);

      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
