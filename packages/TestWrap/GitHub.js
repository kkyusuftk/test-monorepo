const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: "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" });

async function getOpenPRsWithChanges(owner, repo, paths) {
  try {
    let allOpenPRs = [];
    let page = 1;
    let perPage = 30; // GitHub API default per_page

    // Paginate through the results until you get at least 200 PRs or exhaust all PRs
    while (allOpenPRs.length < 800) {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls",
        {
          owner: owner,
          repo: repo,
          state: "open",
          per_page: perPage,
          page: page
        }
      );

      const openPRs = response.data;
      
      // If there are no more PRs, break out of the loop
      if (openPRs.length === 0) break;

      allOpenPRs = allOpenPRs.concat(openPRs);
      page++;
    }

    const relevantPRs = {};

    // Initialize keys in relevantPRs object based on paths
    paths.forEach(path => {
      const key = path.split('/').pop();
      relevantPRs[key] = [];
    });

    // Iterate through each open PR
    for (const pr of allOpenPRs) {
      // Fetch the files changed in the PR
      const filesResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
        {
          owner: owner,
          repo: repo,
          pull_number: pr.number
        }
      );

      const files = filesResponse.data;
      
      // Check if the PR has changes in the specified paths
      for (const path of paths) {
        for (const file of files) {
          if (file.filename.includes(path)) {
            const key = path.split('/').pop();
            relevantPRs[key].push(pr.html_url);
            break; // Move to the next PR
          }
        }
      }
    }

    return relevantPRs;
  } catch (error) {
    console.error("Error occurred:", error);
    return {};
  }
}

// Example usage:
const owner = "CleverTap-Platform";
const repo = "Ultron";
const paths = ["dashboard/dashboard/packages/lib-ui", "dashboard/dashboard/packages/lib-common", "dashboard/dashboard/packages/lib-testing"];

getOpenPRsWithChanges(owner, repo, paths)
  .then(relevantPRs => {
    // Print relevant PRs
    console.log(relevantPRs);
  });
