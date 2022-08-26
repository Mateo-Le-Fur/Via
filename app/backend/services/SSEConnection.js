/* eslint-disable quote-props */
class SSE {
  constructor(res) {
    this.res = res;
  }

  init() {
    this.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
  }

  send(data, event) {
    this.res.write(`event: ${event}\n`);
    this.res.write(`data: ${JSON.stringify(data)} \n\n`);
  }
}

module.exports = SSE;
