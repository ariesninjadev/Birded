
![Logo](https://cdn.discordapp.com/attachments/1101301422009614356/1122722111014834206/favi.png)


# Birded

Birded is a web game produced by Ninjam Studios releasing in 2024.


## Authors

- [@Aries](https://www.github.com/ariesninjadev)
- [@Chloe](https://github.com/ogniK5377)
- [@Kaleb](https://www.github.com/kaleb)


## Deployment

To deploy this project run

```bash
  npm run deploy
```


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Feedback

If you have any feedback, please reach out to us at official@birded.tech


## License

[MIT](https://choosealicense.com/licenses/mit/)

