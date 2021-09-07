import { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
const { Octokit } = require("@octokit/core");


function Home() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [err, setError] = useState(null);
  let history = useHistory();
  const octokit = new Octokit({ auth: process.env.REACT_APP_OCTOKIT_KEY });


  return (
    <HomeContainer>
      <Title>Github Issue Viewer</Title>
      <Input
        placeholder="Paste a link to a github repo"
        onChange={(e) => {
          const splitUrl = e.target.value.split("/");
          setOwner(splitUrl[splitUrl.length - 2])
          setRepo(splitUrl[splitUrl.length - 1])
        }}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            if (!!owner && !!repo) {
              try {
                const response = await octokit.request(`GET /repos/{owner}/{repo}`, {
                  owner,
                  repo,
                });
                history.push(`/issues/${owner}/${repo}`)
              } catch (err) {
                setError(err.message);
              }
            }
          }
        }}
      />
      {
        err && <Error>{err}</Error>
      }
    </HomeContainer>
  )
}

export const Error = styled.div`
  color: red;
  text-align: center;
`

const HomeContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  text-align: center;
  font-weight: 900;
  font-size: 2em;
  margin: 100px 0 20px 20px;
`

const Input = styled.input`
  padding: 10px;
  margin: 0 auto;
  width: 500px;
  background: url(/search.svg) no-repeat left center;
  border-radius: 5px;
  text-align: center;
  background-size: 20px;
  background-position: 2px;
  text-decoration: none;
`

export default Home;
