const Issue = require('../db/models/Issue');

const verifyUrlQuery = (query) => {
  const issueSchema = [
    '_id',
    'issue_title',
    'issue_text',
    'created_on',
    'updated_on',
    'created_by',
    'assigned_to',
    'open',
    'status_text',
  ];
  return query.every((param) => issueSchema.includes(param));
};

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get((req, res) => {
      console.log('GET request to ', req.originalUrl);
      const { project } = req.params;
      const queryKeys = Object.keys(req.query);

      // Check if there are no params in url(/api/issues/apitest?open=true)
      if (queryKeys.length === 0) {
        Issue.find({ project: project })
          .select('-__v -project')
          .exec((err, issues) => {
            if (err) console.log('unable to get issue from db;\n', err);

            res.json(issues);
          });
        // Check if query contains only Issue schema properties
      } else if (verifyUrlQuery(queryKeys)) {
        const issueToSearch = {
          ...req.query,
          project: project,
        };
        Issue.find(issueToSearch)
          .select('-__v -project')
          .exec((err, issues) => {
            if (err) console.log('unable to get issue from db;\n', err);

            res.json(issues);
          });
      } else {
        res.status(404).json({ error: 'invalid query in url' });
      }
    })

    .post((req, res) => {
      console.log('POST request to ', req.originalUrl);
      const { project } = req.params;
      const issueToCreate = {
        ...req.body,
        project: project,
      };

      Issue.create(issueToCreate, (err, issue) => {
        if (err) {
          console.log(`unable to create new issue. \n ${err}`);
          res.json({ error: 'required field(s) missing' });
        } else {
          const {
            _id,
            issue_title,
            issue_text,
            created_on,
            updated_on,
            created_by,
            assigned_to,
            open,
            status_text,
          } = issue;

          res.json({
            _id: _id,
            issue_title: issue_title,
            issue_text: issue_text,
            created_on: created_on,
            updated_on: updated_on,
            created_by: created_by,
            assigned_to: assigned_to,
            open: open,
            status_text: status_text,
          });
        }
      });
    })

    .put((req, res) => {
      console.log('PUT request to ', req.originalUrl);
      if (req.body._id) {
        if (
          Object.entries(req.body).length > 1 &&
          Object.entries(req.body)[0].includes('_id')
        ) {
          Issue.findByIdAndUpdate(req.body._id, req.body, (err, issue) => {
            if (err) console.log(err);
            if (!issue) {
              return res.json({ error: 'could not update', _id: req.body._id });
            }
            return res.json({ result: 'successfully updated', _id: issue._id });
          });
        } else {
          res.json({ error: 'no update field(s) sent', _id: req.body._id });
        }
      } else {
        res.json({ error: 'missing _id' });
      }
    })

    .delete((req, res) => {
      console.log('DELETE request to ', req.originalUrl);
      if (req.body._id) {
        Issue.findOneAndDelete({ _id: req.body._id }, (err, issue) => {
          if (err) console.log(err);
          if (!issue) {
            return res.json({ error: 'could not delete', _id: req.body._id });
          }
          return res.json({
            result: 'successfully deleted',
            _id: req.body._id,
          });
        });
      } else {
        res.json({ error: 'missing _id' });
      }
    });
};
