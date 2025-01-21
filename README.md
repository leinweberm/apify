# apify task

## rules
- The goal of the exercise is to find out if you can write solid code and solve problems.
- Try to finish the exercise as soon as possible. There isn’t a hard deadline but we might prefer earlier candidates. From our experience, candidates take between 2 hours and 2 days to deliver the solution.
- Please do not fake it by asking your more experienced friend. We will find out and it will erode the trust between us.
- Take your time and think it through. Write nice and clean code. Add comments explaining complex parts. Solve it but then refactor it to a robust and readable solution.
- We will not explain the exercise in the middle, you have to send us the whole solution at once. But we are happy if you write comments about what was not clear and why you solved it the way you did.
- Please use JavaScript/TypeScript as a programming language
- Once you solve the problem, try to optimize it so it uses the least amount of requests.
- Don’t use ChatGPT or Copilot to write your solution. The next steps in hiring for this position are 2 live coding interviews with similarly difficult exercises so we need to know if you can write this solution by hand (using your editor of course).

## specifications
1. Your goal is to extract all products from an imaginary e-commerce JSON API with limited results per search. The API URL origin is [`https://api.ecommerce.com/products`](https://api.ecommerce.com/products) . This URL doesn’t exist (it is only imaginary) so don’t try to run the code 🙂
2. The API is called via a simple GET request without a need for special headers and it will return JSON data.
3. Every API call will return max 1000 products. Your goal is to overcome this limitation by creating requests for specific price ranges of products. You don’t know upfront how many products there are total but this number is returned from the API.
4. Each product on the API costs somewhere between $0 and $100,000. 
5. You can make the request more specific by adding a `minPrice` and `maxPrice` query parameters. This way we can overcome the 1000 limit of results per API call. **The API doesn’t support any other parameters.**
6. Create an algorithm that will ensure that all products are scraped and accumulate all products into a single array called `products`.
7. This is an example response of the JSON API. `total` means how many products there are on the API for this price range (it will be a different number for whole website or different price range). `count` means how many were returned on this API call (max is 1000). `products` is an array with the length of `count`. We don't care about what is inside the product objects.
```json
{
  "total": 0,
  "count": 0,
  "products": [{}, {}]
}
```
- Is there some expectations your code relies on? If yes, write it in the comments. Could the code be written in a way that does not depend on these expectations?

## expectations
- product prices follow standart format xxxx.xx
- there is no more than 1000 products for smallest possible price range of 0.01
- somewhat stable connection to remote server (number of retries can be specified)

## possible improvements
- considering the task specification I can't think of anything, otherwise I would have implemented it.
