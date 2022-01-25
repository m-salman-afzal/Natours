class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // * below are some methods that can be used to query the data required
  filter() {
    // * 1
    // const toursData = await Tour.find();
    // this.query.find();

    // * 2
    // const toursData = await Tour.find({
    //   difficulty: 'easy',
    //   duration: 5,
    // });

    // * 3
    // const toursData = await Tour.find().where('duration').gte(20);

    // * 4
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, excludedFields);
    // const toursData = await Tour.find(queryObj);

    // * 5
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(typeof JSON.parse(queryStr));

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  // * sort the response with the given query
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // * send only the specified fields as requested by the query
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // * apply pagination
  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page1 = this.queryString.page * 1 || 1;
      const limit1 = this.queryString.limit * 1 || 1;
      const skip1 = (page1 - 1) * limit1;

      this.query = this.query.skip(skip1).limit(limit1);
    }
    // if (this.queryStr.page) {
    //   const totalDocs = await Tour.countDocuments();
    //   console.log(totalDocs);
    //   if (totalDocs < skip) {
    //     throw new Error('Page does not exist');
    //   }
    // }
    return this;
  }
}

export { APIFeatures };
