from typing import Optional
from fastapi import status
from fastapi.responses import JSONResponse


class JsonResponse(dict):
    def __init__(self) -> None:
        """
        init
        """
        self["detail"] = ""

    def success(self, detail: Optional[str] = "ok", **kwargs) -> JSONResponse:
        """
        成功响应
        """
        self["detail"] = detail
        if kwargs:
            self.update(**kwargs)
        return JSONResponse(content=self, status_code=status.HTTP_200_OK)

    def error(
        self,
        error: Optional[str] = "internet server error",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        **kwargs
    ) -> JSONResponse:
        """
        程序出错时响应
        """
        self["detail"] = error
        if kwargs:
            self.update(**kwargs)
        return JSONResponse(content=self, status_code=status_code)

    def fail(
        self,
        detail: Optional[str] = "fail",
        status_code=status.HTTP_400_BAD_REQUEST,
        **kwargs
    ) -> JSONResponse:
        """
        请求失败响应
        """
        self["detail"] = detail
        if kwargs:
            self.update(**kwargs)
        return JSONResponse(content=self, status_code=status_code)


json_response = JsonResponse()


if __name__ == "__main__":
    print(json_response.success().body)
