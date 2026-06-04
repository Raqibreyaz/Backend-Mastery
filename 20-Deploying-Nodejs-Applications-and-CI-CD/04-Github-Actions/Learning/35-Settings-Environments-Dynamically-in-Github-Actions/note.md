1. A GitHub Actions workflow is stored in the repository, but a push only triggers it if the workflow exists on the branch being pushed.  
2. A workflow file on branch `x` does not automatically run for pushes to branch `y`.  
3. `on: push` means “run on pushes,” but still only within branches where that workflow file is present.  
4. If branch `y` has no workflow file, its push will not trigger a workflow that exists only on branch `x`.  
5. To make behavior consistent across branches, teams often keep workflow files synced between branches.  
6. Branch filters like `branches: [main]` further restrict which pushes can trigger the workflow.  
7. `github.ref_name` tells you which branch actually triggered the run.  
8. The safest mental model is: event comes from the pushed branch, and the workflow must be defined on that branch to start.