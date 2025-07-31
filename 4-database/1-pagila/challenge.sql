
/*
    Challenge 1.
    Write a SQL query that counts the number of films in each category in the Pagila database.
    - The query should return two columns: category and film_count
    - category should display the name of each category
    - film_count should show the total number of films in that category
    - Results should be grouped by category name
 */


-- your query here

SELECT c.name category, COUNT(c.category_id) film_count
FROM category c
    INNER JOIN film_category fc ON c.category_id = fc.category_id
GROUP BY c.name;

 /*
    Challenge 2.
    Write a SQL query that finds the top 5 customers who have spent the most money in the Pagila database.
    - The query should return three columns: first_name, last_name, and total_spent
    - total_spent should show the sum of all payments made by that customer
    - Results should be ordered by total_spent in descending order
    - The query should limit results to only the top 5 highest-spending customers
 */

 -- your query here

SELECT c.first_name, c.last_name, SUM(p.amount) total_spent
FROM customer c
         INNER JOIN payment p ON c.customer_id = p.customer_id
GROUP BY c.first_name, c.last_name
ORDER BY total_spent DESC
LIMIT 5;


/*
    Challenge 3.
    Write a SQL query that lists all film titles that have been rented in the past 10 years in the Pagila database.
    - The query should return one column: title
    - title should display the name of each film that has been rented
    - The time period for "recent" should be within the last 10 years from the current date
    - Results should only include films that have rental records in this time period
*/


-- your query here

SELECT DISTINCT f.title FROM film f
         INNER JOIN inventory i ON i.film_id = f.film_id
         INNER JOIN rental r ON r.inventory_id = i.inventory_id
WHERE CURRENT_TIMESTAMP - Interval '10 years' < r.rental_date
ORDER BY f.title;


/*
    Challenge 4.
    Write a SQL query that lists all films that have never been rented in the Pagila database.
    - The query should return two columns: title and inventory_id
    - title should display the name of each film that has never been rented
    - inventory_id should show the inventory ID of the specific copy
*/


-- your query here

SELECT f.title FROM film f
 INNER JOIN inventory i ON i.film_id = f.film_id
WHERE i.inventory_id NOT IN (SELECT DISTINCT r.inventory_id FROM rental r)



/*
    Challenge 5.
    Write a SQL query that lists all films that were rented more times than the average rental count per film in the Pagila database.
    - The query should return two columns: title and rental_count
    - title should display the name of each film
    - rental_count should show the total number of times the film was rented
*/



-- your query here
SELECT f.title, COUNT(r.rental_id) as rental_count FROM film f
         INNER JOIN inventory i ON i.film_id = f.film_id
         INNER JOIN rental r ON r.inventory_id = i.inventory_id
GROUP BY f.title
HAVING COUNT(r.rental_id) > (SELECT COUNT(ren.rental_id) / COUNT(DISTINCT fm.film_id) FROM rental ren
FULL JOIN inventory inv on inv.inventory_id = ren.inventory_id
FULL JOIN film fm on fm.film_id = inv.inventory_id);


WITH count_rental AS (SELECT COUNT(r.rental_id) as count_rental FROM rental r),
     count_film AS (SELECT COUNT(f.film_id) as count_film FROM film f),
     average_rental_count
         AS (SELECT
                 (SELECT count_rental FROM count_rental) / (SELECT count_film FROM count_film) AS average_rental_count)
SELECT f.title, COUNT(r.rental_id) as rental_count
FROM film f
         INNER JOIN inventory i ON i.film_id = f.film_id
         INNER JOIN rental r ON r.inventory_id = i.inventory_id
GROUP BY f.title
HAVING COUNT(r.rental_id) > (SELECT average_rental_count FROM average_rental_count);


/*
    Challenge 6.
    Write a SQL query that calculates rental activity for each customer.
    - The query should return the customer's first_name and last_name
    - It should also return their first rental date as first_rental
    - Their most recent rental date should be shown as last_rental
    - The difference in days between the first and last rentals should be shown as rental_span_days
    - Results should be grouped by customer and ordered by rental_span_days in descending order
*/

-- your query here

SELECT c.first_name, c.last_name, MIN(r.rental_date) AS first_rental, MAX(r.rental_date) AS last_rental, 
       (MAX(r.rental_date) - MIN(r.rental_date)) AS rental_span_days FROM rental r
    INNER JOIN customer c ON r.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY rental_span_days DESC;

/*
    Challenge 7.
    Find all customers who have not rented movies from every available genre.
    - The result should include the customer's first_name and last_name
    - Only include customers who are missing at least one genre in their rental history
*/


-- your query here
SELECT c.first_name, c.last_name FROM rental r
    INNER JOIN customer c ON r.customer_id = c.customer_id
    INNER JOIN inventory i ON i.inventory_id = r.inventory_id
    INNER JOIN film f ON f.film_id = i.film_id
    INNER JOIN film_category fc ON f.film_id = fc.film_id
    INNER JOIN category cat ON cat.category_id = fc.category_id
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(DISTINCT fc.category_id) < (SELECT COUNT(cat2.category_id) FROM category cat2);


/*
    Challenge 8.
    Create a materialized view that summarizes total rental revenue per film category.

    First, write a SQL query that returns the category name and the total revenue generated by rentals in that category.

    Use the following tables: payment, rental, inventory, film, film_category, and category.

    - Group the results by category name and order them by total revenue (descending).
    - Then, turn your query into a materialized view named revenue_by_category.
    - Query the materialized view to return:
    - All categories and their total revenue.
    - The top 3 categories by revenue.
    - Finally, refresh the materialized view manually using SQL.

    Once you finish the exercise, please answer the following questions: 
    
    When would you prefer a materialized view over a regular view? 
    How often should it be refreshed?
*/
-- Answers
/*   
    When would you prefer a materialized view over a regular view? 
       When you want to store the data in the materialized view to get a quickly access improving the performance, 
       and is recommended when the data in the original table won't be changed constantly.

    How often should it be refreshed?
        In depent of the data traffic, I think that weekly will be a good refreshing time but is ideal to be monthly.
*/
-- your work here
CREATE MATERIALIZED VIEW IF NOT EXISTS revenue_by_category
AS (
    SELECT c.name, SUM(p.amount) total_revenue
    FROM rental r
        INNER JOIN payment p ON r.rental_id = p.rental_id
        INNER JOIN inventory i ON i.inventory_id = r.inventory_id
        INNER JOIN film f ON f.film_id = i.film_id
        INNER JOIN film_category fc ON f.film_id = fc.film_id
        INNER JOIN category c ON c.category_id = fc.category_id
    GROUP BY c.name
    ORDER BY total_revenue DESC);

SELECT * FROM revenue_by_category;

SELECT * FROM revenue_by_category LIMIT 3;

REFRESH MATERIALIZED VIEW revenue_by_category;



