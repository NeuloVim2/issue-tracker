const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    suite('POST request to /api/issues/{project}', () => {
        it('Create an issue with every field', (done) => {

            let requestData = {
                issue_title: "test1",
                issue_text: "test1 text",
                created_by: "testUser",
                assigned_to: "testUser2",
                status_text: "Pending",
            }

            chai
                .request(server)
                .post('/api/issues/:project')
                .type('form')
                .send(requestData)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    let date = new Date().toISOString();
             

                    assert.equal(res.status, 200);
                    assert.isNotEmpty(res.body._id, "_id - is empty");
                    assert.equal(res.body.issue_title, requestData.issue_title, "issue_title - invalid");
                    assert.equal(res.body.issue_text, requestData.issue_text, "issue_text - invalid");
                    assert.operator(res.body.created_on, '<=', date, 'created_on is invalid');
                    assert.operator(res.body.updated_on, '<=', date, 'created_on is invalid');
                    assert.equal(res.body.created_by,  requestData.created_by, "created_by - invalid");
                    assert.equal(res.body.assigned_to, requestData.assigned_to, "assigned_to - invalid");
                    assert.isTrue(res.body.open, 'open is not true');
                    assert.equal(res.body.status_text, requestData.status_text, "status_text - invalid");
                    done();
                });

        })
        it('Create an issue with only required fields', () => {

        })
        it('Create an issue with missing required fields', () => {

        })
    })
});
