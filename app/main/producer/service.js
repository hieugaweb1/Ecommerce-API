'use strict';
const knex = require('../../db/connection')
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');

class ProducerService extends BaseServiceCRUD {
  constructor() {
    super(Models.Producer, 'Producer');
  }

  async getMany(query) {
   try {
    //const builder = this.model.query().select(knex.raw('distinct ("name")'))

    const builder = this.model.queryBuilder(query).eager('categories')
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
   }catch(e){
     console.log(e.message)
   }
  }
  async getManyDistinct() {
    const builder = this.model.query().select(knex.raw('distinct ("name")'))
    

    return builder;
  }


  async getManyByCategoryId(query, id) {
    const builder = this.model.queryBuilder(query).eager('categories')
      .where('categoryId', id)
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("name") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = ProducerService;
