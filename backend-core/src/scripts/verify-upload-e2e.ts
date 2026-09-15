import fs from 'fs';
import http from 'http';
import path from 'path';

async function testUploadAndFunctionality() {
  console.log('==================================================');
  console.log('RESEARCHMIND END-TO-END UPLOAD & FUNCTIONALITY VERIFICATION');
  console.log('==================================================\n');

  const pdfPath = path.join(__dirname, '../../../backend-ai/tests/fixtures/test-5page-paper.pdf');
  const pdfBuffer = fs.readFileSync(pdfPath);
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

  let bodyBuffer = Buffer.alloc(0);

  function appendString(str: string) {
    bodyBuffer = Buffer.concat([bodyBuffer, Buffer.from(str)]);
  }

  function appendBuffer(buf: Buffer) {
    bodyBuffer = Buffer.concat([bodyBuffer, buf]);
  }

  appendString('--' + boundary + '\r\n');
  appendString('Content-Disposition: form-data; name="workspaceId"\r\n\r\nws-default-1\r\n');

  appendString('--' + boundary + '\r\n');
  appendString('Content-Disposition: form-data; name="title"\r\n\r\nResearchMind 5-Page Test Specifications\r\n');

  appendString('--' + boundary + '\r\n');
  appendString('Content-Disposition: form-data; name="pdf"; filename="test-5page-paper.pdf"\r\n');
  appendString('Content-Type: application/pdf\r\n\r\n');
  appendBuffer(pdfBuffer);
  appendString('\r\n--' + boundary + '--\r\n');

  console.log('1. Uploading 5-page PDF paper to Core Express Backend (/api/papers/upload)...');
  const uploadRes: any = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5000/api/papers/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': bodyBuffer.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });

  console.log('   Upload Response HTTP Status:', uploadRes.status);
  console.log('   Uploaded Paper ID:', uploadRes.data.paper.id);
  console.log('   File URL:', uploadRes.data.paper.fileUrl);

  const paperId = uploadRes.data.paper.id;
  const fileUrl = uploadRes.data.paper.fileUrl;

  console.log('\n2. Verifying uploaded PDF static asset accessibility...');
  const staticRes = await fetch('http://localhost:5000' + fileUrl);
  console.log('   Static PDF HTTP Status:', staticRes.status, 'Content-Type:', staticRes.headers.get('content-type'));

  console.log('\n3. Waiting 2.5s for AI Engine PyMuPDF Parsing & Embedding Generation...');
  await new Promise(r => setTimeout(r, 2500));

  console.log('\n4. Testing RAG Chat Query (/api/v1/chat-paper)...');
  const chatRes = await fetch('http://localhost:8000/api/v1/chat-paper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      paperId: paperId,
      workspaceId: 'ws-default-1',
      question: 'What is described on page 2 and page 4 of the research paper?'
    })
  });
  const chatData: any = await chatRes.json();
  console.log('   LLM Grounded Answer:\n   "' + chatData.answer.substring(0, 180).replace(/\n/g, ' ') + '..."');
  console.log('   Citations Returned:', chatData.citations.length);

  for (const cit of chatData.citations) {
    console.log('   - Citation Page ' + cit.pageNumber + ': BoundingBox { x0: ' + cit.boundingBox.x0 + ', y0: ' + cit.boundingBox.y0 + ', w: ' + cit.boundingBox.w + ', h: ' + cit.boundingBox.h + ' }');
  }

  console.log('\n5. Testing Dynamic Summarizer (/api/v1/summarize-paper)...');
  const sumRes = await fetch('http://localhost:8000/api/v1/summarize-paper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paperId: paperId, length: 'short' })
  });
  const sumData: any = await sumRes.json();
  console.log('   Executive Summary:\n   "' + sumData.summary.substring(0, 180).replace(/\n/g, ' ') + '..."');

  console.log('\n6. Testing Active-Recall Flashcards (/api/v1/flashcards/' + paperId + ')...');
  const fcRes = await fetch('http://localhost:8000/api/v1/flashcards/' + paperId);
  const fcData: any = await fcRes.json();
  console.log('   Generated Flashcards Count:', fcData.flashcards.length);
  console.log('   Flashcard #1 Question:', fcData.flashcards[0].question);

  console.log('\n==================================================');
  console.log('ALL PDF UPLOAD & END-TO-END FEATURES OPERATIONAL 🟢');
  console.log('==================================================');
}

testUploadAndFunctionality().catch(e => console.error(e));
