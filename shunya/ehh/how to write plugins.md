/// How to create plugin (Request Level Plugin)

// step 1 :- Create a class as witten below
// step 2 :- import in the ehhServerconfig the new plugin
// step 3 :- pass the new plugin as an argument to action Entity
// step 4 :- update argument list and add plugin keyword to categorise the plugin

// Note :- Don't take cron class as an argument in actionEntity
// Take cron class in CronJobs as argument
class CronJobs {
  constructor() {
    let argList = arguments[0]["testPlugin"];
    let j = 1;
    argList.forEach((element) => {
      this[element] = arguments[j++];
    });

    this.supportedActions = [
      "createCron",
      "getAllCron",
      "updateCron",
      "deleteCron",
    ];
  }

  // actionEntity :- an instance of action entity
  // entitySchema :- an instance of current working schema
  // data :- request.body.data's data
  // options :- options
  createCron = (actionEntity, entitySchema, data, options = {}) => {};
  getAllCron = (actionEntity, entitySchema, data, options = {}) => {};
  updateCron = (actionEntity, entitySchema, data, options = {}) => {};
  deleteCron = (actionEntity, entitySchema, data, options = {}) => {};
}

export { CronJobs };
