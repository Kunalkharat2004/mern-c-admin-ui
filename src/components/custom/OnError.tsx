import { Button, Result } from "antd"

const OnError = ({refetch}:{refetch:()=>void}) => {
  return (
     <Result
          status="500"
          title="Something went wrong"
          subTitle="Sorry, we encountered an error while fetching the data."
          extra={[
            <Button type="primary" key="retry" onClick={() => refetch()}>
              Retry
            </Button>,
          ]}
        />
  )
}

export default OnError