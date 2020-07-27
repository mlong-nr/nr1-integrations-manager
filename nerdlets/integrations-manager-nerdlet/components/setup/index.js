/* eslint 
no-console: 0
*/
import React from 'react';
import { Grid, Card, List, Segment } from 'semantic-ui-react';
import { DataConsumer } from '../../context/data';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/dockerfile';
import 'brace/theme/monokai';

const dockerfile = `FROM newrelic/infrastructure-bundle:latest

COPY ./nri-sync /var/db/newrelic-infra/newrelic-integrations/bin/
COPY ./nri-sync-config.yml /etc/newrelic-infra/integrations.d/

ENV NRIA_PASSTHROUGH_ENVIRONMENT="NR_UUID,NR_API_KEY,NR_ACCOUNT_ID,NR_COLLECTION"`;

const dockerConfig = `---
integrations:
  - name: nri-sync`;

export default class Setup extends React.PureComponent {
  render() {
    return (
      <DataConsumer>
        {({
          selectedAccount,
          uuid,
          selectedCollection,
          selectedKey,
          apiKeys,
          selectedPage
        }) => {
          const integrationsConfig = `---
  integrations:
    - name: nri-sync
      env:
        # integrations manager nerdpack uuid
        NR_UUID: ${uuid || 'eg. 4c2c66ea-c13d-4b95-9c9a-64183fe68290'}
        # new relic one user api key
        NR_API_KEY: ${
          (selectedKey && selectedKey.key) || '<Select API Key eg.NRAK-123... >'
        }
        # account that contains your config collection
        NR_ACCOUNT_ID: ${
          (selectedAccount && selectedAccount.key) || '<Select account>'
        }
        # name of config collection to sync
        NR_COLLECTION: ${
          (selectedCollection && selectedCollection.label) ||
          '<Select collection>'
        }`;

          return (
            <Grid.Row
              columns={2}
              style={{
                display: selectedPage === 'setup' ? '' : 'none',
                paddingLeft: '10px',
                paddingRight: '10px',
                marginBottom: '10px'
              }}
            >
              <Grid.Column>
                <Card style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>On Host</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <List bulleted>
                      <List.Item>
                        Download <strong>nri-sync</strong>
                        <List.List>
                          <List.Item href="#">Linux</List.Item>
                          <List.Item href="#">Windows</List.Item>
                        </List.List>
                      </List.Item>

                      <List.Item>
                        Binary location:
                        <List.List>
                          <List.Item>Linux</List.Item>
                          <Segment style={{ fontSize: '13px' }}>
                            /var/db/newrelic-infra/newrelic-integrations/bin/
                            <strong>nri-sync</strong>
                          </Segment>

                          <List.Item>Windows</List.Item>
                          <Segment style={{ fontSize: '13px' }}>
                            C:\Program Files\New
                            Relic\newrelic-infra\newrelic-integrations\
                            <strong>nri-sync.exe</strong>
                          </Segment>
                        </List.List>
                      </List.Item>

                      <List.Item>Configuration</List.Item>
                      <br />
                      <AceEditor
                        mode="yaml"
                        theme="monokai"
                        name="configuration"
                        height={'190px'}
                        value={integrationsConfig}
                        editorProps={{ $blockScrolling: true }}
                      />
                    </List>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ width: '100%' }}>
                  <Card.Content>
                    <Card.Header>Container</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <List bulleted>
                      <List.Item>
                        Download <strong>nri-sync</strong>
                        <List.List>
                          <List.Item href="#">Linux</List.Item>
                        </List.List>
                      </List.Item>
                      <List.Item>
                        Save <strong>nri-sync-config.yml</strong>
                      </List.Item>
                      <br />
                      <AceEditor
                        mode="yaml"
                        theme="monokai"
                        name="dockerSyncConfig"
                        height={'70px'}
                        value={dockerConfig}
                        editorProps={{ $blockScrolling: true }}
                      />

                      <br />

                      <List.Item>
                        Copy binary and config to Dockerfile and add passthrough
                        variables.
                      </List.Item>
                      <br />
                      <AceEditor
                        mode="dockerfile"
                        theme="monokai"
                        name="Dockerfile"
                        height={'110px'}
                        value={dockerfile}
                        editorProps={{ $blockScrolling: true }}
                      />
                      <br />
                      <List.Item>
                        Alternatively you can bake separate images with the
                        environment variables defined in each.
                      </List.Item>
                    </List>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          );
        }}
      </DataConsumer>
    );
  }
}