# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

from proto import detection_pb2 as proto_dot_detection__pb2


class PersonDetectionStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.DetectPersons = channel.unary_unary(
                '/detection.PersonDetection/DetectPersons',
                request_serializer=proto_dot_detection__pb2.Empty.SerializeToString,
                response_deserializer=proto_dot_detection__pb2.PersonCount.FromString,
                )


class PersonDetectionServicer(object):
    """Missing associated documentation comment in .proto file."""

    def DetectPersons(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_PersonDetectionServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'DetectPersons': grpc.unary_unary_rpc_method_handler(
                    servicer.DetectPersons,
                    request_deserializer=proto_dot_detection__pb2.Empty.FromString,
                    response_serializer=proto_dot_detection__pb2.PersonCount.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'detection.PersonDetection', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class PersonDetection(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def DetectPersons(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/detection.PersonDetection/DetectPersons',
            proto_dot_detection__pb2.Empty.SerializeToString,
            proto_dot_detection__pb2.PersonCount.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
