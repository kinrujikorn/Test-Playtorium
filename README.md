# Shopping Cart Discount Module

**Full Name:** Rujikorn Rujitanont

## Project Overview

This project is a **Shopping Cart Discount Module** that calculates the final price of items in a cart after applying multiple discount campaigns. The module demonstrates the application of logic, error handling, and React frontend integration with a backend API.

### Features

- Apply multiple discount campaigns in the following order:  
  1. Coupon  
  2. On Top  
  3. Seasonal
- Enforce rules:
  - Only one campaign per category type (Coupon, On Top, Seasonal)
- Supports:
  - Fixed amount and percentage coupons
  - Category-based and points-based On Top discounts
  - Seasonal discounts (Y THB off for every X THB in total)
- Displays:
  - Cart items
  - Selected discounts
  - Total discount applied
  - Final total price
- Basic error handling for invalid inputs

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **HTTP Client:** Axios  
- **Styling:** CSS  
