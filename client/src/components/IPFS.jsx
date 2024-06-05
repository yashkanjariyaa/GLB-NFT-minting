import React, { useState } from "react";

async function uploadToIPFS(file) {
  const added = await ipfs.add(file);
  return `https://ipfs.infura.io/ipfs/${added.path}`;
}

export default uploadToIPFS;