# Shopify_Developer_Intern_Challenge
Application for Shopify Internship

I was gonna use cookies for the cart but I didnt


## API Documentation

### *POST /fetch_all_products*

-- Get all products from the database. Send available=1 to receive only available products (stock over 0)


**Query Parameters**

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
    "title":"Muse Headband v2",
    "price":250,
    "inventory_count":759,
    "id":111
  }
]
```


<br>
<br>


### *POST /fetch_product*

-- Get a specifc product from the database. Send product id to get info about product


**Query Parameters**

| Name | Type | Description | Optional |
| ------------- | ---------- | ------------- | ---------- |
| available |  Int |  Send value of '1' to receive only available products (stock over 0) | Yes |
