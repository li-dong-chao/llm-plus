import datetime


def now():
    """获取当前时间"""
    return datetime.datetime.now()


if __name__ == "__main__":
    print(str(now()))
