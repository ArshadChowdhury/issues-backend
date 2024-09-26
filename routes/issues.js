var express = require("express");
var router = express.Router();
var jsonIssuesArray = require("../public/issuesData.js");

/* GET all issues */
router.get("/", function (req, res, next) {
  // Send the JSON array as the response
  res.json(jsonIssuesArray);
});

/* GET individual issue by id */
router.get("/:id", function (req, res, next) {
  const { id } = req.params;

  // Find the issue by ID
  const issue = jsonIssuesArray.find((issue) => issue.id == id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  // Send the found issue as the response
  res.json(issue);
});

// POST request to add a new issue
router.post("/", function (req, res, next) {
  const { title, description } = req.body;

  // Validate the request body
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  // Generate a new ID based on the existing length and make it so user can't provide id
  const newId = jsonIssuesArray.length
    ? jsonIssuesArray[jsonIssuesArray.length - 1].id + 1
    : 1;

  // Create a new issue object
  const newIssue = {
    id: newId,
    title,
    description,
  };

  // Adding the new issue to the array and respond with the new one
  jsonIssuesArray.push(newIssue);

  res.status(201).json(newIssue);
});

/* PUT request to edit issues by id */
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const { title, description } = req.body;

  const issueIndex = jsonIssuesArray.findIndex((issue) => issue.id == id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Issue not found" });
  }

  // Update the issue properties if provided
  if (title) jsonIssuesArray[issueIndex].title = title;
  if (description) jsonIssuesArray[issueIndex].description = description;

  res.json(jsonIssuesArray[issueIndex]);
});

/* DELETE request to delete an issue by id */
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;

  // Finding the index of the issue to delete if not found throw error.
  const issueIndex = jsonIssuesArray.findIndex((issue) => issue.id == id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Issue not found" });
  }

  // Remove the issue from the array
  const deletedIssue = jsonIssuesArray.splice(issueIndex, 1);

  res.status(200).json(deletedIssue[0]);
});

module.exports = router;
