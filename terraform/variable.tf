variable "defaultRunTime" {
  type = string
  default = "nodejs20.x"
  description = "default run time for this project"
}

variable "NONE_AUTH" {
  type = string
  default = "NONE"
}

variable "AWS_PROXY" {
  type = string
  default = "AWS_PROXY"
}

variable "HTTP_METHOD_POST" {
  type = string
  default = "POST"
}

variable "HTTP_METHOD_GET" {
  type = string
  default = "GET"
}

variable "AMAZON_API_COM" {
  type = string
  default = "apigateway.amazonaws.com"
  description = "principal url for apigateway"
}

variable "defaultPolicyArn" {
  type = string
  default = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  description = "default policy arn for this project and lambdas"
}

variable "getStatsLambda" {
  type = string
  default = "get-stats-lambda"
  description = "variable just for the nama of the redirect url lambda"
}

variable "STAGE" {
  type = string
  default = "dev"
}

variable "defaultStatementId" {
  type = string
  default = "AllowExecutionFromAPIGateway"
}

variable "defaultLambdaAction" {
  type = string
  default = "lambda:InvokeFunction"
}