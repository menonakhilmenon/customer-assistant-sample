# Customer Assistant

A sample project which leverages OpenAI to catalog a list of products.
Customers using the app, can then search for products for their use case, and the application would

1. Provide search results which would best suit their purpose (semantic search)
2. Based on the items customers have chosen, provide recommendation to them for other products that would go along with the items in the cart

# Usage

1. Rename .env.dist to .env and populate the fields as commented in the file
2. Run the startbackend.sh and startfrontend.sh scripts to start the backend and frontend dev servers respectively
3. The page will be available in http://localhost:8087
4. To add products go to http://localhost:8087/products. This will allow you to add products to the vecctorDB which will be the results fetched during search operation (Some products were already added and uploaded in the repo, so simply cloning the repo would give some data).