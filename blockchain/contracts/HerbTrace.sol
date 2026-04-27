// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HerbTrace {
    struct BatchAnchor {
        string batchCode;
        string stage;
        string metadataHash;
        uint256 timestamp;
    }

    mapping(string => BatchAnchor[]) private traceLedger;

    function anchorBatch(
        string memory batchCode,
        string memory stage,
        string memory metadataHash
    ) external {
        traceLedger[batchCode].push(
            BatchAnchor({
                batchCode: batchCode,
                stage: stage,
                metadataHash: metadataHash,
                timestamp: block.timestamp
            })
        );
    }

    function getBatchTrace(string memory batchCode)
        external
        view
        returns (BatchAnchor[] memory)
    {
        return traceLedger[batchCode];
    }
}
