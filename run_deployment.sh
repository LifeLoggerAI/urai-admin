#!/bin/bash
# urai-admin deployment script

set -euo pipefail
IFS=$'\n\t'

run_deployment() {
    echo "Running deployment..."

    main() {
        firebase deploy --only apphosting --debug
    }

    main "$@"
}

run_deployment "$@"
