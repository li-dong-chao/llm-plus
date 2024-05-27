from uuid import uuid4


def get_uuid4() -> str:
    """生成uuid4"""
    return str(uuid4())


if __name__ == "__main__":
    print(get_uuid4())
