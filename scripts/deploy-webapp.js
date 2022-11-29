#!/usr/bin/env node

import * as askState from '../.ask/ask-states.json' assert { type: "json" };
import S3SyncClient from 's3-sync-client';
import { S3 } from '@aws-sdk/client-s3';
import mime from 'mime'

const outputs = askState.default.profiles.default.skillInfrastructure['@ask-cli/cfn-deployer'].deployState.default.outputs;
const bucketUriExport = outputs.find(output => output.OutputKey === 'AssetsBucketUri');
const bucketUri = bucketUriExport.OutputValue;

const s3Client = new S3();
const { sync } = new S3SyncClient({ client: s3Client });
console.log(bucketUri);
try {
    await sync('./dist/', bucketUri, {
        commandInput: {
            ContentType: (syncCommandInput) => (
                mime.lookup(syncCommandInput.Key) || 'text/html'
            ),
        },
    });
} catch (e) {
    console.log(e);
}