import logging.config


def setup_logger():
    logging.config.dictConfig(
        {
            "version": 1,
            "formatters": {
                "standard": {
                    "format": "%(asctime)s [%(levelname)s] - %(message)s",
                },
            },
            "handlers": {
                "debug_file": {
                    "class": "logging.handlers.RotatingFileHandler",
                    "filename": "debug.log",
                    "maxBytes": 100000,
                    "backupCount": 5,
                    "level": "DEBUG",
                    "formatter": "standard",
                },
                "info_file": {
                    "class": "logging.handlers.RotatingFileHandler",
                    "filename": "info.log",
                    "maxBytes": 100000,
                    "backupCount": 5,
                    "level": "INFO",
                    "formatter": "standard",
                },
                "error_file": {
                    "class": "logging.handlers.RotatingFileHandler",
                    "filename": "error.log",
                    "maxBytes": 100000,
                    "backupCount": 5,
                    "level": "ERROR",
                    "formatter": "standard",
                },
            },
            "loggers": {
                "debug_logger": {
                    "handlers": ["debug_file"],
                    "level": "DEBUG",
                },
                "info_logger": {
                    "handlers": ["info_file"],
                    "level": "INFO",
                },
                "error_logger": {
                    "handlers": ["error_file"],
                    "level": "ERROR",
                },
            },
        }
    )
