import {
  useParams
} from "react-router-dom";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { Error } from './Home';
const { Octokit } = require("@octokit/core");


const TabItems = {
  "All Issues": "all",
  "Open Issues": "open",
  "Closed Issues": "closed",
  "Pull Requests": "pullRequest"
}

function Issues() {
  let { owner, repo } = useParams();
  let history = useHistory();
  const [issues, setIssues] = useState([])
  const [err, setError] = useState(null);
  const octokit = new Octokit({ auth: process.env.REACT_APP_OCTOKIT_KEY });
  const [currentState, setCurrentState] = useState('all')
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  useBottomScrollListener(() => getIssues());
  const perPage = 9;

  const getIssues = async () => {
    setIsLoading(true);
    let currentIssues = []
    let currentPageInLoop = currentPage;

    try {
      while (currentIssues.length < perPage || currentIssues.length % 3 !== 0) {
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
          owner,
          repo,
          per_page: perPage,
          state: currentState === "pullRequest" ? "all" : currentState,
          page: currentPageInLoop,
        });

        if (currentState === "pullRequest") {
          currentIssues = currentIssues.concat(response.data.filter(issue => !!issue.pull_request))
        } else if (currentState === "open" || currentState == "closed") {
          currentIssues = currentIssues.concat(response.data.filter(issue => !issue.pull_request))
        } else {
          currentIssues = response.data;
        }
        if (response.data.length < 9) {
          break
        }
        currentPageInLoop++;
      }

      setIssues(issues.concat(currentIssues))
      setCurrentPage(currentPageInLoop)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getIssues();
  }, [currentState])

  return (
    <>
      <TitleContainer>
        <Title onClick={() => history.push("/")}>Github Issue Viewer</Title>
        <RepoInfo>{`https://github.com/${owner}/${repo}`}</RepoInfo>
      </TitleContainer>
      <TabsContainer>
        {
          Object.keys(TabItems).map((tabItem) =>
            <TabItem
              style={currentState === TabItems[tabItem] ? {'textDecoration': 'underline'} : {}}
              onClick={() => {
              setIssues([]);
              setCurrentState(TabItems[tabItem])
              setCurrentPage(1);
              setError(null);
            }}>
              {tabItem}
            </TabItem>
          )
        }
      </TabsContainer>
      <IssuesContainer>
        {
          issues.length > 0 &&
          issues.map((issue) =>
            <IssueBox>
              <IssueHeader>
                {issue?.title}
                {issue?.pull_request ?
                  issue?.closed_at ?
                  <PRIcon src={'/issue-closed.svg'}></PRIcon> :
                  <PRIcon src='/pull-request.svg'></PRIcon> :
                  <></>}
              </IssueHeader>
              <IssueBody>{`${issue?.body?.substring(0, 200)}...`}</IssueBody>
              <LabelsContainer>
                {
                  issue.labels.map((label) =>
                    <LabelItem>
                      {
                        label.name
                      }
                    </LabelItem>
                  )
                }
              </LabelsContainer>
            </IssueBox>
          )
        }
      </IssuesContainer>
      {
        isLoading && <Loader />
      }
      {
        !!err ? <Error>{err}</Error> :
        !isLoading && issues.length === 0 &&
        <div>There are no issues or pull requests on this repository.</div>
      }
    </>
  )
}

const Title = styled.div`
    font-weight: 900;
    font-size: 2em;
    cursor: pointer;
`

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const TabItem = styled.div`
  margin: 4px;
  cursor: pointer;
`

const RepoInfo = styled.div`
    float: right;
    font-weight: 200;
    font-size: 1.2em;
`

const TitleContainer = styled.div`
    border: 1px solid black;
    display: flex;
    justify-content: space-between;
    padding: 20px;
`

const IssuesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const IssueBox = styled.div`
  border: 1px solid black;
  padding: 20px;
  width: 350px;
  margin: 25px;
`

const IssueHeader = styled.h4`
  word-wrap: break-word;
`

const IssueBody = styled.p`
  word-wrap: break-word;
`

const LabelsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const LabelItem = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  font-size: 10px;
  padding: 2px;
  margin: 2px;
`

const Loader = styled.div`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid black; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`

const PRIcon = styled.img`
  width: 15px;
  float: right;
`

export default Issues;
