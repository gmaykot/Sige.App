using FakeItEasy;

namespace SIGE.Tests.Unit.Builder
{
    public abstract class BaseDummyFactory<T> : DummyFactory<T>
    {
        public abstract T Instance { get; }
    }
}
