# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: proto/detection.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15proto/detection.proto\x12\tdetection\"\x07\n\x05\x45mpty\"\'\n\x0bPersonCount\x12\x18\n\x10\x64\x65tected_persons\x18\x01 \x01(\x05\x32L\n\x0fPersonDetection\x12\x39\n\rDetectPersons\x12\x10.detection.Empty\x1a\x16.detection.PersonCountb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'proto.detection_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_EMPTY']._serialized_start=36
  _globals['_EMPTY']._serialized_end=43
  _globals['_PERSONCOUNT']._serialized_start=45
  _globals['_PERSONCOUNT']._serialized_end=84
  _globals['_PERSONDETECTION']._serialized_start=86
  _globals['_PERSONDETECTION']._serialized_end=162
# @@protoc_insertion_point(module_scope)
