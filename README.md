# Shopify_Developer_Intern_Challenge
Application for Shopify Internship - <a href="https://docs.google.com/document/d/1J49NAOIoWYOumaoQCKopPfudWI_jsQWVKlXmw1f1r-4/preview?ts=5c2fd489">HERE</a>


**Live Version** - <a href="http://198.50.245.94:1111/">http://198.50.245.94:1111/</a>

-- Alex Zidros

<br>
<br>


## Thought Process

Legit saw the application the night before it was due. So I scrambled to setup a database table following the structure (title, price, inventory_count) and I also added a unique id attribute to make life easier when scrubbing through the DB queries. 

I decided on Node with the web framework Express because I familiar with it from previous projects.

I got all scrambled about the Shopping Cart part because I was thinking of how I should implement it. Cookies? Sessions? I decide just to go with a JSON obj in Frontend Javascript that stored the cart. Thinking I’m not making a full site that needs that data persistence between pages.

Then there's the **/fetch_product** & **/fetch_all_products** that are pretty trival

The biggest time consumer was the **/purchase_cart** because of the idea that every product in the cart has to be confirmed in the database with the right quantity in stock before purchased


<br>
<br>
<br>

## Database Structure and Values - Table
Table - **shopify_items**


| title *(String)* | price *(Float)* | inventory_count *(Int)* | id *(Int)* |
| ------------- | ---------- | ------------- | ---------- |
| Muse Headband v2 |  250 |  759| 111 |
| Macbook Pro |  1700 |  135  | 13572 |
| Nanoleaf Light Pack |  250 |  89 | 864324 |
| Yeezy Boost 350 |  300 |  13 | 2356325 |
| SNES Classic |  100 |  0 | 4444 |

<br>
<br>
<br>

## API Documentation

### *POST /fetch_all_products*

-- Get all products from the database. Send available=1 to receive only available products (stock over 0)



**Query Parameters** - *urlencoded*

| Name | Type | Description | Optional |
| ------------- | ---------- | ------------- | ---------- |
| available |  Int |  Send value of '1' to receive only available products (stock over 0) | Yes |

**Response**

| Name | Type | Description 
| ------------- | ---------- | ------------- |
| title |  String |  Name of the Product |
| price |  Float |  Price of the Product |
| inventory_count |  Int |  Stock of the Product |
| id |  Int |  Internal Database Unique ID of the Product |

**Sample Response**

```
[
  {
    "title":"Yeezy Boost 350",
    "price":300,
    "inventory_count":14,
    "id":2356325
  },
  {
    "title":"Macbook Pro",
    "price":1700,
    "inventory_count":135,
    "id":13572
    }
 ]
```


<br>
<br>
<br>


### *POST /fetch_product*

-- Get a specifc product from the database. Send product id to get info about product


**Query Parameters** - *urlencoded*

| Name | Type | Description | Optional |
| ------------- | ---------- | ------------- | ---------- |
| id |  Int |  Get product from database with associated id | No (Required) |


**Response**

| Name | Type | Description 
| ------------- | ---------- | ------------- |
| title |  String |  Name of the Product |
| price |  Float |  Price of the Product |
| inventory_count |  Int |  Stock of the Product |
| id |  Int |  Internal Database Unique ID of the Product |


**Sample Response**

```
[
  {
    "title":"Muse Headband v2",
    "price":250,
    "inventory_count":759,
    "id":111
  }
]
```

<br>
<br>
<br>


### *POST /purchase_cart*

-- Purchase Products from Cart



**Query Parameters** - *JSON*

| Name | Type | Description | Optional |
| ------------- | ---------- | ------------- | ---------- |
| id |  Int |  Send value of '1' to receive only available products (stock over 0) | No (Required) |
| price |  Float |  Send value of '1' to receive only available products (stock over 0) | No (Required) |
| quantity |  Int |  Send value of '1' to receive only available products (stock over 0) | No (Required) |


**Sample Query**
```
[
  {
    "id":"2356325",
    "price":"300",
    "quantity":4
  },
  {
    "id":"13572",
    "price":"1700",
    "quantity":0
  }
]
```

<br>
<br>

**Response** - *JSON*

| Name | Type | Description 
| ------------- | ---------- | ------------- |
| status |  String |  Name of the Product |
| cost |  Float |  Price of the Product |


**Sample Response**

```
{
  "status":"Good Purchase!",
  "cost":1700
} 
```

<br>
<br>

# Error Responses - *JSON*
| Name | Type | Description 
| ------------- | ---------- | ------------- |
| ERROR |  String |  Description of Error |

**Error Sample Response**


```
{
  ERROR:'Not enough of SNES Classic'
} 
```
<br>
<br>

# SQL Creds File thats not in the Github Repo
### /routes/sql_creds.js

```
module.exports = {
		host : 'localhost',
		user : '-----',
		password : '-------',
		database : 'test',
		multipleStatements: true
}

```


