import fetch from 'node-fetch';

const paramName = process.env.PARAM_NAME ?? "";
const extensionUrl = `http://localhost:2773/systemsmanager/parameters/get/?name=${paramName}`;

export const handler = async (
    event: any
  ): Promise<void> => {
    const response = await fetch(extensionUrl, {
        headers: {
            'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN!
        },
    });

    const data = (await response.json() as ParameterStoreResponse);
    console.log(data.Parameter.Value);
  };

  interface ParameterStoreResponse {
    Parameter: ParameterData;
    ResultMetadata: any;
  }

  interface ParameterData {
    ARN: string;
    DataType: string;
    LastModifiedDate: string;
    Name: string;
    Selector?: string;
    SourceResult?: string;
    Type: string;
    Value: string;
    Version: number;
  }