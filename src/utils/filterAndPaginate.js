// utils/filterAndPaginate.js

const filterAndPaginate = async (model, filters = {}, page = 1, limit = 10) => {
    // Apply filters to the MongoDB query
    let query = {};
    
    // Loop through the filter criteria and apply them to the query
    for (let key in filters) {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: 'i' }; // 'i' for case-insensitive search
      }
    }
  
    // Calculate the skip (for pagination)
    const skip = (page - 1) * limit;
  
    // Execute the query with pagination and filtering
    const results = await model.find(query)
                                .skip(skip)
                                .limit(limit)
                                .exec();
  
    // Get the total number of documents that match the filter criteria (for pagination info)
    const totalCount = await model.countDocuments(query);
  
    return {
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalPages: Math.ceil(totalCount / limit),
          },
      data: results,
     
    };
  };
  
  module.exports = filterAndPaginate;
  