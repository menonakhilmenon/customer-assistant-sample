# Customer Assistant

A sample project which leverages OpenAI to catalog a list of products.
Customers using the app, can then search for products for their use case, and the application would

Managers can add products to the inventory which customers can come and purchase.

For customers :
1. Provide search results which would best suit their purpose (semantic search)
2. Based on the items customers have chosen, provide recommendation to them for other products that would go along with the items in the cart

# Screenshots:

## Semantic Search :
<img width="540" alt="image" src="https://github.com/menonakhilmenon/customer-assistant-sample/assets/28900644/f15a97d3-806b-4116-a3a4-92919b36de74">

## Recommendation :
<img width="540" alt="image" src="https://github.com/menonakhilmenon/customer-assistant-sample/assets/28900644/b926310b-3b41-4875-8208-968c3620d697">


# Usage

1. Make sure to have docker compose and node installed in the system
2. Rename .env.dist to .env and populate the fields as commented in the file
3. Open terminal in the root of the repository.
4. Run the startbackend.sh and startfrontend.sh scripts to start the backend and frontend dev servers respectively
5. The page will be available in http://localhost:8087
6. To add products go to http://localhost:8087/products. This will allow you to add products to the vecctorDB which will be the results fetched during search operation (Some products were already added and uploaded in the repo, so simply cloning the repo would give some data).

# How its done ?

1. The frontend (FE) is written in ReactJS while the backend (BE) is written in expresJS
2. The FE only contains 2 routes, one for the home page which contains a search, and one for the product page, where we can add products (This is just to be used as a helper to add in different products, ideally we won't show this to customers).
3. When customer enters a search query, a semantic search is made against the products which best match the query. The top 5 of these items are returned back to FE.
4. Customers can then add the items to their cart by clicking the + button next to each product.
5. When an item is added, a call is made to the LLM to get the best product that would complement the selected item. This is then displayed as the recommendation.
6. Customers can choose to add the recommended item to the cart or proceed with checking the remaining items.


# Improvements to be made

1. I skipped over almost all of the error scenarios these needs to be covered asap
2. There are no authentication between any of the parties involved right now, FE -> BE communication needs to be authenticated with OAuth 2.0.
3. Test cases should be added!!!
4. The item description is not used anywhere, I thought of using it alongisde the item type in the search results but didn't get the time to do it.
5. The requests and responses made everywhere are just for the quick iteration, these should be corrected to be proper (response should have proper error messages if any, request should properly use tracing).
6. I wrote a loading state in FE, but it does not have any functionality at the moment, this needs to be added. This state is tied for all the results now though, and should be separated for recommendation and semantic search.
7. I have started containerization of both the FE(frontend) and BE(backend) projects, but was unable to finish them, this would be the first improvement which needs to be made.
8. Once containerized the helm charts of both FE and BE needs to be added.
9. Connection to redis does not use TLS and needs to have a password as well
10. The secrets are currently fetched from environment variables directly. Ideally this would be kept in some secret store like Vault, and something like k8s external secrets operator would be used to mount these to the container file system.
11. The queries made to vector DB are not cached and require caching (the redis is already, just need to use it to cache the vector DB queries).
12. Currently ALL the top 5 results are returned from the semantic search query and all of them are displayed in FE as well. This needs to be refined based on the CONFIDENCE_THRESHOLD.
13. The prompts used while they work, do require some additional refinement.
14. The transition of react components used are a bit rigid, some transitions needs to be added to remedy this.
15. The express server can be split further into separate microservices for horizontal scaling (the LLM part should be ideally isolated into a separate service so that other consumers can also leverage its capabilities).
