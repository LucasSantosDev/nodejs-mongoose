const pagination = (perPage, page) => {
  const pagination = [];

  if (perPage && page && Number(perPage) > 0 && Number(page) > 0) {
    pagination.push({ $skip: Number(page - 1) * perPage });
    pagination.push({ $limit: Number(perPage) });
  }

  return pagination;
};

const order = (columnName, directionOrder) => {
  const sort = [];

  if (columnName && directionOrder) {
    sort.push({
      $sort: {
        [columnName]: Number(directionOrder),
      },
    });
  }

  return sort;
};

const match = (query) => {
  const convertArrayToObject = query.reduce(function (result, item) {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  }, {});

  const filterMatch = [{ $match: convertArrayToObject }];

  return filterMatch;
};

const project = (projection) => {
  return [{ $project: projection }];
};

const prepareAggregate = (query) => {
  return query.length > 0 ? query : [{ $match: {} }];
};

const lookup = () => {
  // TODO::Implement code here
};

module.exports = {
  pagination,
  order,
  match,
  project,
  prepareAggregate,
  lookup,
};
