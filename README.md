# jingcafe

### Webpack-Angular1-Es6 and PHP Slim source 

Copyright (c) 2018, free to use in personal and commercial software as per the [license](LICENSE.md).

## Getting Started
Make sure you have php, mysql and composer and npm installed on your machine.
- Clone the project from repository [github.com/mongcheng/angular1-es6-phpslim](https://github.com/mongcheng/jingcafe)
- In your terminal, cd into the cloned folder and run `npm install` and run `composer install`.
- Run`webpack --watch`. This allows you view file changes you make.
- Open a second tab on the terminal and run `php -S 127.0.0.1:8000 -t public` to test website.

### Dependencies 
The app is built using **[Slim](https://www.slimframework.com/)**. However, there ara extra packages used by the app must be installed.
> Install Dependencies
```bash
composer install
```
**List of Dependencies**
- [illuminate/database](https://laravel.com/docs/5.5/eloquent) Eloquent ORM for ActiveRecord implementation and managing data models
- [vlucas/phpdotenv](https://github.com/vlucas/phpdotenv) To load environment variables from `.env` file.
database.
- [phpunit/phpunit](https://phpunit.de/) Testing Framework.

## Running tests

Run `php bakery test` from the root project directory. Any tests included in `sprinkles/*/tests` will be run.

## About the Developer

### Mong Cheng

I'm a junior-full-stack web developer, good at PHP and JavaScript of languages, love finding the solution on overcomplicated problems. In addition, I am experenced in SaaS web applications and try to contribute to community.

## Contributing

Please see our [contributing guidelines](.github/CONTRIBUTING.md) as well as our [style guidelines](STYLE-GUIDE.md).
