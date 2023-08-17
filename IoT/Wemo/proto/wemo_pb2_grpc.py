# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import wemo_pb2 as wemo__pb2


class WemoServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.CreateDevice = channel.unary_unary(
                '/wemo.WemoService/CreateDevice',
                request_serializer=wemo__pb2.CreateDeviceRequest.SerializeToString,
                response_deserializer=wemo__pb2.CreateDeviceResponse.FromString,
                )
        self.GetDeviceStatus = channel.unary_unary(
                '/wemo.WemoService/GetDeviceStatus',
                request_serializer=wemo__pb2.GetDeviceStatusRequest.SerializeToString,
                response_deserializer=wemo__pb2.GetDeviceStatusResponse.FromString,
                )
        self.SetDeviceStatus = channel.unary_unary(
                '/wemo.WemoService/SetDeviceStatus',
                request_serializer=wemo__pb2.SetDeviceStatusRequest.SerializeToString,
                response_deserializer=wemo__pb2.SetDeviceStatusResponse.FromString,
                )


class WemoServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def CreateDevice(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetDeviceStatus(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def SetDeviceStatus(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_WemoServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'CreateDevice': grpc.unary_unary_rpc_method_handler(
                    servicer.CreateDevice,
                    request_deserializer=wemo__pb2.CreateDeviceRequest.FromString,
                    response_serializer=wemo__pb2.CreateDeviceResponse.SerializeToString,
            ),
            'GetDeviceStatus': grpc.unary_unary_rpc_method_handler(
                    servicer.GetDeviceStatus,
                    request_deserializer=wemo__pb2.GetDeviceStatusRequest.FromString,
                    response_serializer=wemo__pb2.GetDeviceStatusResponse.SerializeToString,
            ),
            'SetDeviceStatus': grpc.unary_unary_rpc_method_handler(
                    servicer.SetDeviceStatus,
                    request_deserializer=wemo__pb2.SetDeviceStatusRequest.FromString,
                    response_serializer=wemo__pb2.SetDeviceStatusResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'wemo.WemoService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class WemoService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def CreateDevice(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/wemo.WemoService/CreateDevice',
            wemo__pb2.CreateDeviceRequest.SerializeToString,
            wemo__pb2.CreateDeviceResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetDeviceStatus(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/wemo.WemoService/GetDeviceStatus',
            wemo__pb2.GetDeviceStatusRequest.SerializeToString,
            wemo__pb2.GetDeviceStatusResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def SetDeviceStatus(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/wemo.WemoService/SetDeviceStatus',
            wemo__pb2.SetDeviceStatusRequest.SerializeToString,
            wemo__pb2.SetDeviceStatusResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
