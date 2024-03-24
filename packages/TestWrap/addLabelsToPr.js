const { Octokit } = require('@octokit/rest');

// Create an Octokit instance
const octokit = new Octokit({
    auth: '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' // Replace with your personal access token
});

// Function to assign labels to PR based on author
function assignLabelsToPR(prAuthor) {
    const labelMap = {
        "AshwinSaxena01": ["web-team"],
        // Add more rules as needed
    };

    if (labelMap.hasOwnProperty(prAuthor)) {
        return labelMap[prAuthor];
    } else {
        return [];
    }
}

// Function to retrieve PRs from GitHub API with pagination
async function getAllPRs(owner, repo) {
    let allPRs = [];
    let page = 1;

    try {
        while (allPRs.length < 800) {
            const response = await octokit.pulls.list({
                owner: owner,
                repo: repo,
                per_page: 100, // 100 PRs per page
                page: page
            });

            const prs = response.data;
            if (prs.length === 0) break;

            allPRs = allPRs.concat(prs);
            page++;
        }

        return allPRs // Return only the first 500 PRs
    } catch (error) {
        console.error('Error retrieving PRs:', error);
        return [];
    }
}

// Function to attach labels to a PR
async function attachLabelsToPR(owner, repo, prNumber, labels) {
    try {
        await octokit.issues.addLabels({
            owner: owner,
            repo: repo,
            issue_number: prNumber,
            labels: labels
        });
        console.log(`Labels attached to PR #${prNumber}:`, labels);
    } catch (error) {
        console.error('Error attaching labels to PR:', error);
    }
}

// Example usage
async function main() {
    // Example repository information
    const owner = 'CleverTap-Platform';
    const repo = 'ultron';

    // Get the first 500 PRs from the repository
    const prs = await getAllPRs(owner, repo);

    // Process each PR
    for (const pr of prs) {
        const prNumber = pr.number;
        const prAuthor = pr.user.login;

        // Assign labels based on the PR author
        const labels = assignLabelsToPR(prAuthor);

        // Attach labels to the PR
        await attachLabelsToPR(owner, repo, prNumber, labels);
    }
}

// Call main function
main();
