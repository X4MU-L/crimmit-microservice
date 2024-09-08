PROTO_DIR=libs/shared/src/proto
PROTO_FILES=$(wildcard ${PROTO_DIR}/*.proto)
OUT_DIR=${PROTO_DIR}
PROTOC_GEN_TS_PATH=./node_modules/.bin/protoc-gen-ts_proto

generate:
	protoc --plugin=$(PROTOC_GEN_TS_PATH) \
	--proto_path=${PROTO_DIR} $(PROTO_FILES) \
	--ts_proto_out=$(OUT_DIR) --ts_proto_opt=nestJs=true