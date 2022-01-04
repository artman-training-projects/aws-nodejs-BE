# AWS + Node.js

#### Build and Deploy with Serverless

- BE for https://github.com/ArtMan-8/aws-nodejs
- FE part https://github.com/ArtMan-8/aws-nodejs-FE

## API endpoints

1. Get all products<br />
   `https://3qbxi9uzmg.execute-api.eu-west-1.amazonaws.com/dev/products`

2. Get product by Id<br />
   `https://3qbxi9uzmg.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}`

3. Add product, **PUT** method with body<br />
   `https://3qbxi9uzmg.execute-api.eu-west-1.amazonaws.com/dev/products`

   ```
   {
      "title": "string",
      "description": "string",
      "price": "number,
      "count": "number
   }
   ```
