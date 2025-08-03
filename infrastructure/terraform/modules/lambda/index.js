// Dummy Lambda function - replaced by CodePipeline
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Lambda function not yet deployed by CodePipeline'
        })
    };
};