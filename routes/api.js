'use strict';

const Issue = require('../db/modeles/Issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      console.log("GET request to ", req.originalUrl);
      let project = req.params.project;
      let queryKeys = Object.keys(req.query);
      console.log(queryKeys);

      // Check if there are no params in url(/api/issues/apitest?open=true)
      if (queryKeys.length === 0) {
        Issue.find({ project: project },)
          .select('-__v -project')
          .exec((err, issues) => {
            if (err)
              console.log("unable to get issue from db;\n", err);

            console.log(issues);
            res.json(issues);
          })
      } else {

        //Check if query contains only Issue schema properties
        if (verifyUrlQuery(queryKeys)) {
          let issueToSearch = {
            ...req.query,
            project: project
          };
          Issue.find(issueToSearch)
            .select('-__v -project')
            .exec((err, issues) => {
              if (err)
                console.log("unable to get issue from db;\n", err);

              console.log(issues);
              res.json(issues);
            })
        } else {
          res.status(404)
             .json({error: "invalid query in url"});
        }
      }
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issueToCreate = {
        ...req.body,
        project: project
      };

      Issue.create(issueToCreate, (err, issue) => {
        if (err) {
          console.log(`unable to create new issue. \n ${err}`);
          res.json({ error: 'required field(s) missing' });
        } else {
          let { _id,
            issue_title,
            issue_text,
            created_on,
            updated_on,
            created_by,
            assigned_to,
            open,
            status_text } = issue;

          res.json({
            _id: _id,
            issue_title: issue_title,
            issue_text: issue_text,
            created_on: created_on,
            updated_on: updated_on,
            created_by: created_by,
            assigned_to: assigned_to,
            open: open,
            status_text: status_text
          });
        }
      })
    })

    .put(function (req, res) {
      console.log('make PUT request')
      if(req.body._id){
        console.log('id is true')
        console.log(Object.entries(req.body).length > 0);
        if(Object.entries(req.body).length > 0){
          Issue.findByIdAndUpdate(req.body._id, req.body, (err, issue) => {
            if(err)
              console.log(err);
    
            res.json({result: 'successfully updated', _id: issue._id})
          })
        } else {
          res.json( { error: 'no update field(s) sent', '_id': req.body._id });
        }
      } else {
        res.json({ error: 'missing _id' })
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};

const verifyUrlQuery = (query) => {
  const issueSchema = [
    "_id",
    "issue_title",
    "issue_text",
    "created_on",
    "updated_on",
    "created_by",
    "assigned_to",
    "open",
    "status_text"
  ]
  return query.every((param) => issueSchema.includes(param))
}