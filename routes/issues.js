var express = require("express");
var router = express.Router();
var jsonIssuesArray = require("../public/issuesData.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  // Send the JSON array as the response
  res.json(jsonIssuesArray);
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

  // Generate a new ID based on the existing length
  const newId = jsonIssuesArray.length
    ? jsonIssuesArray[jsonIssuesArray.length - 1].id + 1
    : 1;

  // Create a new issue object
  const newIssue = {
    id: newId,
    title,
    description,
  };

  // Add the new issue to the array
  jsonIssuesArray.push(newIssue);

  // Send the newly added issue as a response
  res.status(201).json(newIssue);
});

// PUT request to update an issue by ID
router.put("/:id", function (req, res, next) {
  const { id } = req.params; // Get the id from the URL
  const { title, description } = req.body; // Get the updated fields from the request body

  // Find the issue by ID
  const issueIndex = jsonIssuesArray.findIndex((issue) => issue.id == id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Issue not found" });
  }

  // Update the issue properties if provided
  if (title) jsonIssuesArray[issueIndex].title = title;
  if (description) jsonIssuesArray[issueIndex].description = description;

  res.json(jsonIssuesArray[issueIndex]);
});

// DELETE request to remove an issue by ID
router.delete("/:id", function (req, res, next) {
  const { id } = req.params; // Get the id from the URL

  // Find the index of the issue to delete
  const issueIndex = jsonIssuesArray.findIndex((issue) => issue.id == id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: "Issue not found" });
  }

  // Remove the issue from the array
  const deletedIssue = jsonIssuesArray.splice(issueIndex, 1);

  // Respond with the deleted issue
  res.status(200).json(deletedIssue[0]);
});

module.exports = router;
