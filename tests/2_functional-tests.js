const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let requestData1 = {
    issue_title: "test1",
    issue_text: "test1 text",
    created_by: "testUser1",
    assigned_to: "testUser2",
    status_text: "pending",
},
    requestData2 = {
        issue_title: "test3",
        issue_text: "test3 text",
        created_by: "testUser3",
    },
    requestData3 = {
        issue_title: "",
        issue_text: "",
        created_by: "",
    }


suite('Functional Tests', function () {
    suite('POST request to /api/issues/{project}', () => {
        it('Create an issue with every field', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .type('form')
                .send(requestData1)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    let date = new Date().toISOString();

                    assert.equal(res.status, 200);
                    assert.isNotEmpty(res.body._id, "_id - is empty");
                    assert.equal(res.body.issue_title, requestData1.issue_title, "issue_title - invalid");
                    assert.equal(res.body.issue_text, requestData1.issue_text, "issue_text - invalid");
                    assert.operator(res.body.created_on, '<=', date, 'created_on is invalid');
                    assert.operator(res.body.updated_on, '<=', date, 'created_on is invalid');
                    assert.equal(res.body.created_by, requestData1.created_by, "created_by - invalid");
                    assert.equal(res.body.assigned_to, requestData1.assigned_to, "assigned_to - invalid");
                    assert.isTrue(res.body.open, 'open is not true');
                    assert.equal(res.body.status_text, requestData1.status_text, "status_text - invalid");
                    done();
                });

        })
        it('Create an issue with only required fields', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .type('form')
                .send(requestData2)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    let date = new Date().toISOString();


                    assert.equal(res.status, 200);
                    assert.isNotEmpty(res.body._id, "_id - is empty");
                    assert.equal(res.body.issue_title, requestData2.issue_title, "issue_title - invalid");
                    assert.equal(res.body.issue_text, requestData2.issue_text, "issue_text - invalid");
                    assert.operator(res.body.created_on, '<=', date, 'created_on is invalid');
                    assert.operator(res.body.updated_on, '<=', date, 'created_on is invalid');
                    assert.equal(res.body.created_by, requestData2.created_by, "created_by - invalid");
                    assert.isEmpty(res.body.assigned_to, "assigned_to - invalid");
                    assert.isTrue(res.body.open, 'open is not true');
                    assert.isEmpty(res.body.status_text, "status_text - invalid");
                    done();
                });
        })
        it('Create an issue with missing required fields', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .type('form')
                .send(requestData3)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing", 'returned value is valid')
                    done();
                })
        })
    })
    suite('GET request to /api/issues/{project}', () => {
        it('View issues on a project', (done) => {

            const returneIssue = [
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

            chai
                .request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'res.body is not array');
                    res.body.forEach((issue) => {
                        Object.keys(issue).forEach((key, index) => assert.equal(key, returneIssue[index], `'${key}' is not present in response`))
                    });
                    done();
                })
        })

        it('View issues on a project with one filter', (done) => {
            console.log(`api/issues/apitest?assigned_to=${requestData1.assigned_to}`);
            chai
                .request(server)
                .get(`/api/issues/apitest?assigned_to=${requestData1.assigned_to}`)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'res.body is not array');
                    res.body.forEach((issue, index) => assert.equal(issue.assigned_to, requestData1.assigned_to, `'assigned_to' for issue #${index} - is invalid`))
                    done();
                })
        })

        it('View issues on a project with multiple filters', (done) => {
            chai
                .request(server)
                .get(`/api/issues/apitest?assigned_to=${requestData1.assigned_to}&status_text=pending`)
                .end((err, res) => {
                    if (err)
                        console.log(err);

                    assert.equal(res.status, 200);
                    assert.isArray(res.body, 'res.body is not array');
                    res.body.forEach((issue, index) => {
                        return assert.equal(issue.assigned_to, requestData1.assigned_to, `'assigned_to' for issue #${index} - is invalid`)
                            && assert.equal(issue.status_text, "pending", `'status_text' for issue #${index} - is invalid`);
                    });
                    done();
                })
        })
    })
});