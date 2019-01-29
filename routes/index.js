const express = require("express");
const router = express.Router();
const Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appxoBTFr9eZvYgDh');

//assign home route
router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/posts", async (req, res) => {
  let postData = [];
  base('All Posts').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 20,
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function (record, i) {
      // console.log('Retrieved', record.get('All Posts'));
      postData[i] = { ...record.fields };
    });

    console.log("postData ", postData);
    res.json({ data: postData });
    // // To fetch the next page of records, call `fetchNextPage`.
    // // If there are more records, `page` will get called again.
    // // If there are no more records, `done` will get called.
    // fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
  });



  // base('All Posts').select({
  //   // fields: ['Selection Test', 'Salary Range 1'],
  //   maxRecords: 3,
  //   view: 'Grid view'
  // }).firstPage(function (err, vacancies) {
  //   if (err) { console.error(err); return; }
  //   // res.json(vacancies);

  //   //allocate vacancies to data
  //   // vacancyData = { ...vacancies };

  //   const promise = new Promise((resolve, reject) => {
  //     vacancies.forEach(function (vacancy, i) {
  //       //add to the currency vacancyData object
  //       vacancyData.push({ ...vacancy.fields });
  //       resolve("Success");
  //     });
  //   });

  //   // const promise2 = new Promise((resolve, reject) => {
  //   //   //loop through each vacancy
  //   //   vacancyData.forEach(function (vacancy, i) {
  //   //     //use the id and get the post details
  //   //     console.log("Vacancy Post ", vacancy["All Posts"]);

  //   //     //loop through each linked post record
  //   //     vacancyData.Posts = getPostByID(vacancy["All Posts"])
  //   //     console.log("VACANCY POSTS ", vacancyData.Posts);
  //   //     // console.log("vacancyData ", vacancyData[i]["All Posts"]);
  //   //     resolve("SUCCESS")
  //   //     // vacancy.Posts.forEach(function (post, j) {
  //   //     //   //get the post linked information 
  //   //     //   base("Posts").find(post, function (err, postFound) {
  //   //     //     // console.log("Post Found ", i, postFound.fields);
  //   //     //     vacancyData.Posts = postFound.fields;
  //   //     //     resolve("Success");
  //   //     //   });
  //   //     // })
  //   //   });
  //   // })

  //   res.json({ data: vacancyData })




  //   // await vacancies.forEach(async function (vacancy, x) {
  //   //   //selects a specific field from the Vacancy table
  //   //   // console.log('Retrieved', vacancy.get('Posts'));

  //   //   console.log(vacancy.fields["Vacancy Name"]);
  //   //   // vacancyData.push({ ["Vacancy Name"]: vacancy.fields["Vacancy Name"] })

  //   //   console.log(vacancy.fields["Posts"]);
  //   //   await vacancy.fields["Posts"].forEach(function (post, i) {
  //   //     console.log("POSTS  ", post)
  //   //     //get the post information
  //   //     base("Posts").find(post, function (err, result) {
  //   //       console.log("POSTS RESULT ++++++++++++++++++++++++++++> ", i, result.fields.Posts);
  //   //       console.log(" VACANCY ", vacancyData[x]);
  //   //       // vacancyData[x].Posts = result.fields.Posts;
  //   //       // console.log("VACANCY POST ", vacancyData[x].Posts)
  //   //       let pair = { Posts: result.fields.Posts }
  //   //       vacancyData[x] = { ...vacancyData[x], ...pair }
  //   //     })
  //   //   })
  //   // });

  // });
});


//return post information
getPostByID = function (postArray) {
  return new Promise(function (resolve, reject) {
    base('All Posts').select({
      filterByFormula: filterBy(postArray),
      maxRecords: postArray.length,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record) {
        console.log('Retrieved', record.get('Posts'));
        resolve(record);
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) { console.error(err); return; }
    });
  });
}

filterBy = function (recArray) {
  return new Promise(function (resolve, reject) {
    let filterString = '';
    recArray.forEach((recordId, index) => {
      filterString += (`RECORD_ID() = '${recordId}'`);
      if (index < (recArray.length - 1)) {
        filterString += (', ');
      } else {
        filterString += (')');
      }
    });
    console.log("FILTER STRING ====> ", filterString);
    resolve(filterString)
  });
}

router.get("/logout", async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    req.logout();
    res.redirect("/");
  });
});

module.exports = router;
