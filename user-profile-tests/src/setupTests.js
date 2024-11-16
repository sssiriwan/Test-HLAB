import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock TransformStream
class MockTransformStream {
  constructor() {
    this.readable = {};
    this.writable = {};
  }
}

global.TransformStream = MockTransformStream;

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor() {
    this.name = 'mock';
    this.onmessage = null;
  }

  postMessage() {}

  close() {}
}

global.BroadcastChannel = MockBroadcastChannel;
