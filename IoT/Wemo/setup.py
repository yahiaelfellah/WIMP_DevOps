from setuptools import setup, Extension
from Cython.Build import cythonize

ext_modules = cythonize([
    Extension(
        "app",  # Name of the extension module
        sources=["app_grpc.py"],  # Path to your .pyx file
    ),
], build_dir="dist")

setup(
    name="app_grpc",
    ext_modules=ext_modules,
)
