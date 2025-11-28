//code for .tf
//LAMBDA GET STATS 
resource "aws_lambda_function" "getStatslambda" {
  filename         = data.archive_file.redirectUrlLambda.output_path
  function_name    = var.getStatsLambda
  handler          = "${var.getStatsLambda}.handler"
  runtime          = var.defaultRunTime
  timeout          = 900
  memory_size      = 256
  role             = aws_iam_role.getStatslambdaRole.arn
  source_code_hash = data.archive_file.redirectUrlLambda.output_base64sha256

  environment {
    variables = {
      ShortLinkTable : data.aws_dynamodb_table.ShortLinkTable.name
    }
  }

  depends_on = [data.archive_file.redirectUrlLambda, aws_iam_role_policy_attachment.getStatslambdaAttach]
}
//POLICY
resource "aws_iam_role_policy" "getStatslambdaPolicy" {
  name   = "${var.getStatsLambda}-policy"
  policy = data.aws_iam_policy_document.lambda_get_stats_execution.json
  role   = aws_iam_role.getStatslambdaRole.id
}
//ROLE
resource "aws_iam_role" "getStatslambdaRole" {
  name               = "${var.getStatsLambda}-execution-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}
//ATTACHMENT
resource "aws_iam_role_policy_attachment" "getStatslambdaAttach" {
  role       = aws_iam_role.getStatslambdaRole.name
  policy_arn = var.defaultPolicyArn
}
//------------GATEWAY FOR GET STATS -----------
resource "aws_api_gateway_rest_api" "getStatsGtw" {
  name        = "${var.getStatsLambda}RestApi"
  description = "Rest Api realted for the get statrs lambda"
}
//RESOURCE ROOT PATH /stats
resource "aws_api_gateway_resource" "getStatsGtwRootResource" {
  rest_api_id = aws_api_gateway_rest_api.getStatsGtw.id
  parent_id   = aws_api_gateway_rest_api.getStatsGtw.root_resource_id
  path_part   = "stats"
}
//RESOURCE  DYNAMYC PATH VALUE /{codigo}
resource "aws_api_gateway_resource" "getStatsGtwCodigoResource" {
  rest_api_id = aws_api_gateway_rest_api.getStatsGtw.id
  parent_id   = aws_api_gateway_resource.getStatsGtwRootResource.id
  path_part   = "{codigo}"
}
//METHOD
resource "aws_api_gateway_method" "getStatsGtwMethod" {
  rest_api_id   = aws_api_gateway_rest_api.getStatsGtw.id
  resource_id   = aws_api_gateway_resource.getStatsGtwCodigoResource.id
  http_method   = var.HTTP_METHOD_GET
  authorization = var.NONE_AUTH
}
//CONECTIONG LAMBDA WITH THE GATEWAY
resource "aws_api_gateway_integration" "lmbGtwGetStatsIntegration" {
  rest_api_id             = aws_api_gateway_rest_api.getStatsGtw.id
  resource_id             = aws_api_gateway_resource.getStatsGtwCodigoResource.id
  http_method             = aws_api_gateway_method.getStatsGtwMethod.http_method
  integration_http_method = var.HTTP_METHOD_POST
  type                    = var.AWS_PROXY
  uri                     = aws_lambda_function.getStatslambda.invoke_arn
}
//PERMISSIONS
resource "aws_lambda_permission" "getStatsGtwPermissions" {
  statement_id  = var.defaultStatementId
  action        = var.defaultLambdaAction
  function_name = var.getStatsLambda
  principal     = var.AMAZON_API_COM
  source_arn    = "${aws_api_gateway_rest_api.getStatsGtw.execution_arn}/*/${var.HTTP_METHOD_GET}/${aws_api_gateway_resource.getStatsGtwRootResource.path_part}/${aws_api_gateway_resource.getStatsGtwCodigoResource.path_part}"
  depends_on    = [aws_lambda_function.getStatslambda]
}
//DEPLOY
resource "aws_api_gateway_deployment" "getStatsGtwDeploy" {
  rest_api_id = aws_api_gateway_rest_api.getStatsGtw.id
  depends_on  = [aws_api_gateway_integration.lmbGtwGetStatsIntegration, aws_lambda_permission.getStatsGtwPermissions]
}
//STAGE
resource "aws_api_gateway_stage" "getStatsGtwStage" {
  deployment_id = aws_api_gateway_deployment.getStatsGtwDeploy.id
  rest_api_id   = aws_api_gateway_rest_api.getStatsGtw.id
  stage_name    = var.STAGE
}
//OUTPUT URL
output "getStatsUrl" {
  value = "${aws_api_gateway_stage.getStatsGtwStage.invoke_url}/${aws_api_gateway_resource.getStatsGtwRootResource.path_part}/${aws_api_gateway_resource.getStatsGtwCodigoResource.path_part}"
}
