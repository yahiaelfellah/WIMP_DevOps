# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: proto/temperature.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x17proto/temperature.proto\x12\x0btemperature\"\"\n\x12TemperatureRequest\x12\x0c\n\x04unit\x18\x01 \x01(\t\"$\n\x13TemperatureResponse\x12\r\n\x05value\x18\x01 \x01(\t2i\n\x12TemperatureService\x12S\n\x0eGetTemperature\x12\x1f.temperature.TemperatureRequest\x1a .temperature.TemperatureResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'proto.temperature_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_TEMPERATUREREQUEST']._serialized_start=40
  _globals['_TEMPERATUREREQUEST']._serialized_end=74
  _globals['_TEMPERATURERESPONSE']._serialized_start=76
  _globals['_TEMPERATURERESPONSE']._serialized_end=112
  _globals['_TEMPERATURESERVICE']._serialized_start=114
  _globals['_TEMPERATURESERVICE']._serialized_end=219
# @@protoc_insertion_point(module_scope)
